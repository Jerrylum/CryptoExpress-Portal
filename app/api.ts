"use server";

export class InternalGoodCollection {
  static async add() { }

  static async remove() { }

  static async update() { }

  static async list() { }
}

export class InternalAddressCollection {
  static async add() { }

  static async remove() { }

  static async update() { }

  static async list() { }

  static async releaseToPublic() { }

  static async removeFromPublic() { }
}

export class InternalCourierCollection {
  static async add() { }

  static async remove() { }

  static async update() { }

  static async list() { }

  static async releaseToPublic() { }

  static async removeFromPublic() { }
}

export class Contract {

  static async setRouteProposal() { }

  static async getAllRouteProposals() { }

  static async removeRouteProposal() { }

  static async signRouteProposal() { }

  static async commitRouteProposal() { }

  static async commitProgress() { }

}
