const validateApiKey = async (project, apiKey = "", ...scopeGroups) => {
  // const key = await getApiKey({ project, value: apiKey ?? "" });

  //   if (!key) throw new ResponseError(401, "ApiKey is invalid");

  // const keyScopes = (key && key.scopes) || [];

  const keyScopes = ["read:function", "read:data"];

  let hasAccess = false;
  console.log({ hasAccess });

  let accesses = scopeGroups.map((scopes) => {
    console.log({ hasAccess, scopes });

    for (let i = 0; i < scopes.length; i++) {
      console.log({ hasAccess, scopes, i });
      if (!keyScopes.includes(scopes[i])) {
        return false;
      }
    }
    return true;
    // console.log("end of inner loop");
    // console.log("reached here", hasAccess, scopeGroups, keyScopes);
    // hasAccess = true;
    // break;
  });
  console.log(accesses)

  hasAccess = accesses.some((a) => a === true);
  // if (!hasAccess) throw new ResponseError(401, "You don't have access");

  return hasAccess;

  // return true;
};

const result = validateApiKey(
  "a",
  "b",
  ["read:function", "read:data"],
  ["project:admin"],
  ["read:function"]
);
console.log(result);
