type JSONObject = {
  [x: string]: JSONValue;
};

type JSONArray = Array<JSONValue>;

export type JSONValue = string | number | boolean | JSONObject | JSONArray;
