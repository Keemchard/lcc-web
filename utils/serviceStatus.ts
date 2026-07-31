interface ServiceStatus {
  text: string;
  link: string;
}

export enum Service {
  PRAYER_MEETING = "Prayer Meeting",
  SUNDAY_SERVICE = "Sunday Service",
  BIBLE_STUDY = "Bible Study",
  DAWN_WATCH = "Dawn Watch",
}
/**
 * Returns the service status based on the provided date.
 * If the day is Wednesday and not the 4th Wednesday of the month,
 * it returns { text: "Join Live", link: <link> }.
 * Otherwise, it returns { text: "Face to Face", link: "" }.
 *
 * @param date The date to evaluate (defaults to current date)
 * @param livestreamUrl The URL for the livestream (defaults to LCC Facebook live link)
 */
export function getServiceStatus(
  date: Date = new Date(),
  livestreamUrl: string = "https://www.facebook.com/livingwatercommunitychurch/live",
): ServiceStatus {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, ...
  const dayOfMonth = date.getDate();

  // Wednesday is day 3
  if (day === 3) {
    const occurrence = Math.ceil(dayOfMonth / 7);
    const isFourthWednesday = occurrence === 4;

    if (!isFourthWednesday) {
      return {
        text: "Join Live",
        link: livestreamUrl,
      };
    }
  }

  return {
    text: "Face to Face",
    link: "",
  };
}
