import fs from "fs";
import { AddressWithPrivateKey, CourierWithPrivateKey } from "@/internal/Models";
import { faker } from '@faker-js/faker';
import { Good } from "@/chaincode/Models";
import { randomUUID } from "@/internal/Utils";

const goods: Good[] = [];
for (let i = 0; i < 10; i++) {
  const obj: Good = {
    uuid: randomUUID(),
    name: faker.commerce.productName(),
    barcode: faker.number.int({min: 1000000000000, max: 9999999999999}).toString()
  };
  goods.push(obj);
}

fs.writeFileSync("db/goods.json", JSON.stringify(goods));

const addrWithPKs: AddressWithPrivateKey[] = [];
for (let i = 0; i < 10; i++) {
  const obj = AddressWithPrivateKey.generate(
    faker.location.streetAddress(),
    faker.location.secondaryAddress(),
    faker.person.fullName()
  );
  addrWithPKs.push(obj);
}

fs.writeFileSync("db/addresses.json", JSON.stringify(addrWithPKs));

const courierWithPKs: CourierWithPrivateKey[] = [];
for (let i = 0; i < 10; i++) {
  const obj = CourierWithPrivateKey.generate(
    faker.person.fullName(),
    faker.company.name(),
    faker.phone.number()
  );
  courierWithPKs.push(obj);
}

fs.writeFileSync("db/couriers.json", JSON.stringify(courierWithPKs));
