import ClientDB from '~/schemas/Client';
import randomJS from 'random-js';

const random = randomJS();

class Client {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(clientDB) {
    const { _id, name, contactName, address, phone, email, notes, companyLogoKey } = clientDB;

    return {
      id: _id,
      name,
      contactName,
      address,
      phone,
      email,
      notes,
      companyLogoKey,
      activeSites: random.integer(1, 100)
    };
  }

  async _mapModels(clientData = []) {
    return clientData.map((client) => {
      const { name, contactName, address, phone, email, notes, companyLogoKey, _id } = client;
      return {
        id: _id,
        name,
        contactName,
        address,
        phone,
        email,
        notes,
        companyLogoKey,
        activeSites: random.integer(1, 100)
      };
    });
  }

  async create(clientRequest) {
    const { name, address, contactName, phone, email, notes, companyLogoKey } = clientRequest;

    const client = new ClientDB({
      name,
      contactName,
      address,
      phone,
      email,
      notes,
      companyLogoKey
    });

    return client.save().catch((err) => {
      throw new Error(err);
    });
  }

  async list(filter) {
    const query = { deleted: false };
    const { clientId, name, contactName, clientIds } = filter;

    if (clientId) {
      query._id = clientId;
    }

    if (name && typeof name === 'string') {
      query.name = { $regex: name };
    }

    if (contactName && typeof contactName === 'string') {
      query.contactName = { $regex: contactName };
    }

    if (clientIds && clientIds.length > 0) {
      query._id = { $in: [...clientIds] };
    }

    return ClientDB.find(query)
      .then(data => this._mapModels(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getById(clientId) {
    return ClientDB.findOne({ _id: clientId, deleted: false })
      .then(data => this._mapModel(data))
      .catch((err) => {
        throw new Error(err);
      });
  }
  async findAndUpdate(clientId, newData) {
    return ClientDB.findOneAndUpdate({ _id: clientId, deleted: false }, newData, { new: true })
      .then(data => this._mapModel(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getAll() {
    return ClientDB.find({ deleted: false });
  }

  async deleteClient(clientId) {
    return ClientDB.findOneAndUpdate({ _id: clientId, deleted: false }, { deleted: true })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }
}

module.exports = Client;
