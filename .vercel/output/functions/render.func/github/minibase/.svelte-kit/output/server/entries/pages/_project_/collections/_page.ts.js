async function load({ parent }) {
  const data = await parent();
  console.log(data);
  return data;
}
export {
  load
};
