import DronePartnerDB from '~/schemas/DronePartner';
import randomJS from 'random-js';

const random = randomJS();

class DronePartner {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(dronePartnerDB = {}) {
    if (!dronePartnerDB) { return null; }
    const {
      _id: id, name, contactName, createdDate, phone, email, notes
    } = dronePartnerDB;
    return {
      id,
      name,
      contactName,
      createdDate,
      phone,
      email,
      notes
    };
  }

  async _mapModels(data = []) {
    return data.map((item) => {
      const {
        name, contactName, createdDate, phone, email, notes, _id
      } = item;
      return {
        id: _id,
        name,
        contactName,
        createdDate,
        phone,
        email,
        notes,
        activeJobs: random.integer(1, 100),
        completedJobs: random.integer(1, 100),
        averageTurnAround: `${random.integer(1, 30)} days`
      };
    });
  }

  async create(dronePartnerRequest) {
    const {
      name, contactName, phone, email, notes
    } = dronePartnerRequest;

    const client = new DronePartnerDB({
      name,
      contactName,
      phone,
      email,
      notes
    });

    return client.save();
  }

  async list(filter) {
    const query = { deleted: false };
    const { clientId, name, contactName } = filter;

    if (clientId) {
      query.clientId = clientId;
    }

    if (name && typeof name === 'string') {
      query.name = { $regex: name };
    }

    if (contactName && typeof contactName === 'string') {
      query.contactName = { $regex: contactName };
    }

    return DronePartnerDB.find(query)
      .then(data => this._mapModels(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getById(dronePartnerId) {
    return DronePartnerDB.findOne({ _id: dronePartnerId, deleted: false })
      .then(data => this._mapModel(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getAll() {
    return DronePartnerDB.find({ deleted: false });
  }
}

module.exports = DronePartner;
