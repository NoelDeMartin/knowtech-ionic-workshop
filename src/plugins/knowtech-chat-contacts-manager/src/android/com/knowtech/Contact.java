package com.knowtech;

import android.content.Intent;
import android.provider.ContactsContract;

import org.json.JSONException;
import org.json.JSONObject;

public class Contact {

  private String name;

  public static Contact fromJson(JSONObject json) throws JSONException {
    return new Contact(json.getString("name"));
  }

  public Contact(String name) {
    this.name = name;
  }

  public void populateIntent(Intent intent) {
    intent.putExtra(ContactsContract.Intents.Insert.NAME, this.name);
  }

  public JSONObject toJson() throws JSONException {
    JSONObject json = new JSONObject();
    json.put("name", this.name);
    return json;
  }

}
