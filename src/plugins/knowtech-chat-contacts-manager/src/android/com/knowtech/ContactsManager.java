package com.knowtech;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PermissionHelper;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.provider.ContactsContract;
import android.util.Log;

import java.util.ArrayList;
import java.util.Date;

public class ContactsManager extends CordovaPlugin {

  private static final String TAG = "ContactsManager";

  private static final int REQUEST_PERMISSION_CODE = 1;

  private CallbackContext callbackContext;

  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    Log.d(TAG, "Initializing ContactsManager");
  }

  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {

    this.callbackContext = callbackContext;

    if(action.equals("getContacts")) {
      this.getContacts();
    } else if (action.equals("addContact")) {
      Contact contact = Contact.fromJson(args.getJSONObject(0));
      Intent intent = new Intent(ContactsContract.Intents.Insert.ACTION);
      intent.setType(ContactsContract.RawContacts.CONTENT_TYPE);
      contact.populateIntent(intent);
      this.cordova.getActivity().getApplicationContext().startActivity(intent);
      callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
    }

    return true;
  }

  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults)
    throws JSONException
  {
    for (int result: grantResults) {
      if (result == PackageManager.PERMISSION_GRANTED && requestCode == REQUEST_PERMISSION_CODE) {
        this.getContacts();
      }
    }
  }

  private void getContacts() {
    if (!PermissionHelper.hasPermission(this, Manifest.permission.READ_CONTACTS)) {
      PermissionHelper.requestPermission(this, REQUEST_PERMISSION_CODE, Manifest.permission.READ_CONTACTS);
      return;
    }

    this.cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        Context context = ContactsManager.this.cordova.getActivity().getApplicationContext();
        ContentResolver contentResolver = context.getContentResolver();
        Cursor cursor = contentResolver.query(ContactsContract.Contacts.CONTENT_URI, null, null, null, null);

        Contact contact;
        JSONArray contacts = new JSONArray();

        if ((cursor != null ? cursor.getCount() : 0) > 0) {
          while (cursor != null && cursor.moveToNext()) {
            String name = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
            contact = new Contact(name);
            try {
              contacts.put(contact.toJson());
            } catch (JSONException e) {
              // Silence exception
            }
          }
        }

        if (cursor != null){
          cursor.close();
        }

        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, contacts));
      }
    });

  }

}