export class MutationResult {
  constructor(objectType?: string | null, objectID?: string | null) {
    this.objectType = objectType;
    this.objectID = objectID;
  }

  objectType?: string | null;
  objectID?: string | null;
  success = true;
  timestamp: number = new Date().getTime();
}
