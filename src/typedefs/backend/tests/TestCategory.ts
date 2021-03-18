import { TimestampedObject } from "../common/TimestampedObject";

export interface TestCategory extends TimestampedObject {
  id: number,
  category_id: number | null,
  lang: "es",
  name: string,
  pivot: {
    test_id: number,
    category_id: number
  }
}
