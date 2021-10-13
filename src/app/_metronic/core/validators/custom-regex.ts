export class CustomRegex {
  public static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public static phoneNumberPattern = '^(?=.*[0-9])[- +()0-9]+$';
  public static namePatteren = '^[a-zA-Z]+(([,. -][a-zA-Z ])?[a-zA-Z]*)*$';
  public static schoolNamePattern = '^[a-zA-Z0-9-.()/\\&]+(([a-zA-Z0-9- .-s()/,\\&])?[a-zA-Z]*){1,50}$';
  public static numbersOnly='^[0-9]*$'
}
