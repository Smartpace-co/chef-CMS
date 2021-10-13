export class SubscriptionPkgs {
  public static subscriptionPkgs: any = [
    {
      id: 1,
      title: "Platinum",
      value: "platinum",
      packageFor: "student",
      grades: [{ item_id: 1, item_text: "Grade1" }],
      lessons: [{ item_id: 1, item_text: "Lesson 1" }],
      validity:365,
      gracePeriod:0,
      price:100,
      maximumUsers:3,
      status: "Active",
    },
    { id: 2, title: "Gold", value: "gold", status: "Active" },
    { id: 3, title: "Silver", value: "silver", status: "Active" },
  ];
}
