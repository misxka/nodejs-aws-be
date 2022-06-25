export const log = (scope: string, event: unknown) => {
  console.log(`\t${scope}`);
  console.log(`Date: ${new Date(Date.now())}`);
  console.log(event);
};
