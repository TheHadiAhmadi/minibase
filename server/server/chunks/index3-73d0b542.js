const codes = {};
function addCode({ name, code }) {
  codes[name] = code;
  console.log({ codes });
  return { name, code };
}
function getCode({ name }) {
  return {
    code: codes[name],
    name
  };
}

export { addCode as a, getCode as g };
//# sourceMappingURL=index3-73d0b542.js.map
