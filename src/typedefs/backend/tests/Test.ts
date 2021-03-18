import { TimestampedObject } from "../common/TimestampedObject";
import { TestCategory } from "./TestCategory";

enum TestStatus {
  Enabled = 1
}

export interface Test extends TimestampedObject {
  id: number,
  test_id: number | null,
  lang: "es",
  name: string,
  image: string,
  introduction: string,
  description: string,
  status: TestStatus,
  categories: TestCategory[],
  addictions: unknown[] 
}
