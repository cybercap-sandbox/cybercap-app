/**
 * Returns the first letters of the first and last name totalling to 2 letters
 *
 * @param name  - Name to abbreviate
 * @returns - Abbreviation of the name
 * @example
 * getNameAbbreviation("John Doe") // "JD"
 * getNameAbbreviation("John") // "J"
 * getNameAbbreviation("John Doe Smith") // "JS"
 */
export const getNameAbbreviation = (name: string) => {
  if (!name) {
    // check if name is empty
    return "";
  }
  const nameArray = name.split(" ");
  let abbreviation = "";
  if (nameArray.length === 1) {
    // check if nameArray has only one element
    abbreviation = name.charAt(0);
  } else if (nameArray.length > 1) {
    // check if nameArray has more than one element
    const firstName = nameArray[0] ?? "";
    const lastName = nameArray[nameArray.length - 1] ?? "";
    abbreviation = firstName.charAt(0) + lastName.charAt(0); // get first letter of first and last name
  }
  return abbreviation.toUpperCase();
};
