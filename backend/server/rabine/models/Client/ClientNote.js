import ClientNoteDB from '~/schemas/ClientNote';

class ClientNote {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(clientNote = {}) {
    const {
      _id,
      clientId,
      clientName,
      notes,
      createdDate
    } = clientNote;


    return {
      id: _id,
      clientId,
      client: clientName,
      notes,
      createdDate
    };
  }

  async _mapModels(data = []) {
    return data.map((item) => {
      const {
        _id,
        clientId,
        clientName,
        notes,
        createdDate
      } = item;

      return {
        id: _id,
        clientId,
        client: clientName,
        notes,
        createdDate
      };
    });
  }


  async create(clientNoteRequest) {
    const {
      clientId,
      client: clientName,
      notes
    } = clientNoteRequest;

    return this.site.client
    .getById(clientId)
    .then((client) => {

      if (!client) {
        throw new Error('No client found');
      }

      const clientNote = new ClientNoteDB({
        clientId,
        clientName,
        notes
      });

      return clientNote.save()
      .then(data => this._mapModel(data));
    })
    .catch((err) => { throw new Error(err); });


  }

  async list(clientId) {
    const query = { deleted: false, clientId };

    return ClientNoteDB.find(query)
    .then(data => this._mapModels(data))
    .catch((err) => { throw new Error(err); });
  }

  async getById(noteId) {
    return ClientNoteDB.findOne({ _id: noteId, deleted: false })
    .then(data => this._mapModel(data))
    .catch((err) => { throw new Error(err); });
  }

}

module.exports = ClientNote;
