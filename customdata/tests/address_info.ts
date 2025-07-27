import { field, serialize } from "@dao-xyz/borsh";

export class AddressInfo {
  @field({ type: "string" })
  name: string = "";

  @field({ type: "u8" })
  houseNumber: number = 0;

  @field({ type: "string" })
  street: string = "";

  @field({ type: "string" })
  city: string = "";

  constructor(fields: Partial<AddressInfo>) {
    Object.assign(this, fields);
  }
}

const addressInfo = new AddressInfo({
  name: "John Doe",
  houseNumber: 123,
  street: "Main St",
  city: "Anytown",
});

export const ADDRESS_INFO_SIZE = serialize(addressInfo).length;
