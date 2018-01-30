package com.knowtech;

import org.json.JSONException;
import org.json.JSONObject;

public class Contact {

  private String name;

  public Contact(String name) {
    this.name = name;
  }

  public JSONObject toJson() throws JSONException {
    JSONObject json = new JSONObject();
    json.put("name", this.name);
    return json;
  }

}
