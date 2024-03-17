"use client";

import { Address } from "@/chaincode/Models";
import { AddressWithPrivateKey } from "@/internal/Models";
import { TableNode } from "@table-library/react-table-library/types/table";
import * as React from "react";

class AnyAddressNode implements TableNode {
  constructor(public _obj: Address | AddressWithPrivateKey) {}

  get id() {
    return this._obj.hashId;
  }

  get hashId() {
    return this._obj.hashId;
  }

  get line1() {
    return this._obj.line1;
  }

  get line2() {
    return this._obj.line2;
  }

  get recipient() {
    return this._obj.recipient;
  }

  get canExport() {
    return "privateKey" in this._obj;
  }
}
