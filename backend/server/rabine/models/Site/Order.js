import UserDB from '~/schemas/User';
import SiteDB from '~/schemas/Site';
import SiteOrderDB from '~/schemas/SiteOrder';
import SiteOrderActivityDB from '~/schemas/SiteOrderActivity';
import SiteOrderInstructionDB from '~/schemas/SiteOrderInstruction';
import SiteOrderServiceDB from '~/schemas/SiteOrderService';
import SiteOrderNoteDB from '~/schemas/SiteOrderNote';
import ClientDB from '~/schemas/Client';
import PlanDeployDB from '~/schemas/PlanDeploy';

import {
  STATUS_MAP,
  getReadableStatus
} from '~/constants/siteOrderStatus';

import { getSignedURL } from '~/util/s3';

/**
 * Order
 * @constructor
 */
class Order {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _getUserById(userId) {
    const found = await UserDB.findOne({ _id: userId });
    if (!found) { return {}; }
    return found._doc;
  }

  async _getReadableStatusLog(statusLog = []) {
    const promises = statusLog.map(async one => ({
      ...one,
      completedByUser: await this._getUserById(one._id)
    }));

    return Promise.all(promises);
  }

  /**
   * Site resolver.
   * @param {string} siteId - MongoDB ObjectId.
   * @return {object} resolved site document.
   */
  async _resolveSite(siteId) {
    const found = await SiteDB.findOne({ _id: siteId });
    if (!found) { return {}; }
    return found._doc;
  }

  /**
   * Client resolver.
   * @param {string} clientId - MongoDB ObjectId.
   * @return {object} resolved client document.
   */
  async _resolveClient(clientId) {
    const found = await ClientDB.findOne({ _id: clientId });
    if (!found) { return {}; }
    return found._doc;
  }

  /**
   * Drone Plan resolver.
   * @param {string} dronePlanId - MongoDB ObjectId.
   * @return {object} resolved drone plan document.
   */
  async _resolveDronePlan(dronePlanId) {
    const found = await PlanDeployDB.findOne({ id: dronePlanId });
    if (!found) { return {}; }
    return found._doc;
  }

  /**
   * Order resolver.
   * @param {object} SiteOrderDB document.
   * @return {object} resolved site order document with dynamic fields.
   */
  async _resolveOrder(one = {}) {
    const site = await this._resolveSite(one.siteId);
    const client = await this._resolveClient(one.clientId);
    const dronePlan = await this._resolveDronePlan(one.dronePlanId);
    const services = await this._resolveServices(one._id);

    const result = {
      ...one._doc,
      clientName: client && client.name ? client.name : null,
      clientContactName: client && client.contactName ? client.contactName : null,
      dronePlan,
      site,
      services
    };

    return result;
  }

  /**
   * Orders look up.
   * @param {array} list.
   * @return {array} list of resolved orders documents.
   */
  async _resolveOrders(list) {
    const promises = list.map(item => this._resolveOrder(item));
    return Promise.all(promises).then(list => list.map(one => one));
  }

  /**
   * Order service resolver.
   * @param {string} serviceId - MongoDB ObjectId.
   * @return {object} resolved site service document.
   */
  async _resolveService(serviceId) {
    const found = await SiteOrderServiceDB.findOne({ _id: serviceId });
    if (!found) { return {}; }
    return found._doc;
  }

  /**
   * Order services look up.
   * @param {string} orderId - MongoDB ObjectId.
   * @return {array} list of resolved site services documents.
   */
  async _resolveServices(orderId) {
    const services = await SiteOrderServiceDB.find({
      orderId
    }).then(list => list.map(one => ({
      ...one._doc,
      statusLog: this._getReadableStatusLog(one.statusLog),
      readableStatus: getReadableStatus(one.status)
    })));

    return services;
  }

  /**
   * Order activity resolver.
   * @param {object} SiteOrderNoteDB document.
   * @return {object} resolved site activity document with dynamic fields.
   */
  async _resolveOrderActivityItem(one = {}) {
    const user = await this._getUserById(one.userId);
    return {
      ...one._doc,
      user: {
        username: user.username,
        userFullName: user.fullName
      }
    };
  }

  /**
   * Order activity list look up.
   * @param {array} list.
   * @return {array} list of resolved site activity liss documents.
   */
  async _resolveOrderActivity(list) {
    const promises = list.map(one => this._resolveOrderActivityItem(one));
    return Promise.all(promises).then(list => list.map(one => one));
  }

  /**
   * Order note resolver.
   * @param {object} SiteOrderNoteDB document.
   * @return {object} resolved site note document with dynamic fields.
   */
  async _resolveOrderNote(one = {}) {
    const user = await this._getUserById(one.userId);

    return {
      ...one._doc,
      user: {
        username: user.username,
        userFullName: user.fullName
      }
    };
  }

  /**
   * Order notes look up.
   * @param {array} list.
   * @return {array} list of resolved site notes documents.
   */
  async _resolveOrderNotes(list) {
    const promises = list.map(item => this._resolveOrderNote(item));
    return Promise.all(promises).then(list => list.map(one => one));
  }

  /**
   * Order instruction resolver.
   * @param {object} SiteOrderInstructionDB document.
   * @return {object} resolved site instruction document with dynamic fields.
   */
  async _resolveOrderInstruction(one = {}) {
    const user = await this._getUserById(one.userId);
    return {
      ...one._doc,
      user
    };
  }

  /**
   * Order instructions look up.
   * @param {array} list.
   * @return {array} list of resolved site instructions documents.
   */
  async _resolveOrderInstructions(list) {
    const promises = list.map(item => this._resolveOrderInstruction(item));
    return Promise.all(promises).then(list => list.map(one => one));
  }

  /**
   * Finds all existing Orders.
   * @param {string} siteId - MongoDB ObjectId.
   * @return {array} list of site orders for the given site.
   */
  async findAll() {
    const found = await SiteOrderDB.find().then(list => list);
    return this._resolveOrders(found);
  }

  /**
   * Finds all existing Orders by siteId.
   * @param {string} siteId - MongoDB ObjectId.
   * @return {array} list of site orders for the given site.
   */
  async findAllBySiteId(siteId) {
    const found = await SiteOrderDB.find({ siteId });
    return this._resolveOrders(found);
  }

  /**
   * Finds existing Order by _id.
   * @param {string} _id - MongoDB ObjectId.
   * @return {object} site order document.
   */
  async findOneById(_id) {
    const found = await SiteOrderDB.findOne({ _id });
    return this._resolveOrder(found);
  }

  /**
   * Creates new Order Service.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {object} created site order document.
   */
  async createOrder({ payload = {}, user = {} }) {
    const createdOrder = await SiteOrderDB({
      siteId: payload.siteId,
      clientId: payload.clientId,

      dronePlanId: payload.dronePlanId,
      dronePlanName: payload.dronePlanName,
      droneCost: payload.droneCost,

      name: payload.name,
      address: payload.address,
      addressLocation: payload.addressLocation,

      deadline: payload.deadline,
      rabineS3Folder: payload.rabineS3Folder
    }).save().then(one => one);

    const { services = [] } = payload;

    const createdServices = services.map(async (service) => {
      const { type, cost } = service;

      return this.createOrderService({
        user,
        payload: {
          type,
          cost,
          orderId: createdOrder._id,
          siteId: payload.siteId,
          status: STATUS_MAP.NEW_ORDER
        }
      });
    });

    await SiteOrderActivityDB({
      siteId: payload.siteId,
      orderId: createdOrder._id,
      userId: user._id,
      type: 'ORDER_CREATED'
    }).save();

    return Promise.all(createdServices)
      .then(() => this._resolveOrder(createdOrder));
  }

  /**
   * Creates new Order Service.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {object} created site order document.
   */
  async createOrderService({ payload = {}, user = {} }) {
    const created = await SiteOrderServiceDB({
      orderId: payload.orderId,
      siteId: payload.siteId,
      type: payload.type,
      cost: payload.cost,
      status: payload.status,
      statusLog: [{
        name: payload.status,
        completedByUserId: user._id,
        completedAt: new Date()
      }]
    }).save();

    await SiteOrderActivityDB({
      siteId: payload.siteId,
      orderId: payload.orderId,
      userId: user._id,
      type: 'ORDER_SERVICE_CREATED',
      content: `${payload.type} – ${payload.status}`
    }).save();

    return this._resolveOrder(created);
  }

  /**
   * Updates Order Services by Order _id.
   * @param {string} _id - MongoDB ObjectId.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {object} updated site order document.
   */
  async updateOrderServicesByOrderId({ _id, payload = {}, user = {} }) {
    const foundOrder = await SiteOrderDB.findOne({ _id });
    if (!foundOrder) {
      throw new Error('not-found');
    }

    const { siteId } = foundOrder;
    const { service: payloadService } = payload;
    const { type, status } = payloadService;

    const site = await this._resolveSite(siteId);
    if (!site) {
      throw new Error('not-found');
    }
    const { cost } = site;

    const statusLog = this._getStatusLog({
      orderId: _id,
      type,
      status,
      user
    });

    const orderService = await SiteOrderServiceDB.find({ orderId: _id, type });
    console.log('orderService: ', orderService);

    if (orderService) {
      await SiteOrderServiceDB.update({ orderId: _id, type }, {
        $set: { status },
        $push: { statusLog }
      });

      await SiteOrderActivityDB({
        siteId,
        type: 'ORDER_SERVICE_CHANGED',
        orderId: _id,
        userId: user._id,
        content: `${type} – ${status}`
      }).save();
    } else {
      await this.createOrderService({
        payload: {
          type,
          siteId,
          status,
          cost,
          orderId: _id
        },
        user
      });
    }

    return this._resolveOrder(foundOrder);
  }

  async _getStatusLog({ orderId, type, status, user }) {
    const statusKeys = Object.keys(STATUS_MAP);
    const index = statusKeys.indexOf(status);
    if (statusKeys.indexOf(status) === -1) {
      throw new Error('invalid order service status');
    }

    const skippedStatusKeys = statusKeys.filter((key, keyIndex) => keyIndex < index);
    const existingKeys = await SiteOrderServiceDB.find({ orderId, type });
    const missingSkippedKeys = skippedStatusKeys.filter((key) => {
      return existingKeys.indexOf(key) !== -1;
    });

    return missingSkippedKeys.map(name => ({
      name,
      completedByUserId: user._id,
      completedAt: new Date()
    }));
  }

  /**
   * Finds all Order ctivity.
   * @param {string} orderId - MongoDB ObjectId.
   * @return {array} list of order activity documents for the given order.
   */
  async findAllOrderActivityByOrderId(orderId) {
    const found = await SiteOrderActivityDB.find({
      orderId
    }).then(list => list);
    return this._resolveOrderActivity(found);
  }

  /**
   * Finds all Order notes.
   * @param {string} orderId - MongoDB ObjectId.
   * @return {array} list of order notes for the given order.
   */
  async findAllOrderNotesByOrderId(orderId) {
    const found = await SiteOrderNoteDB.find({ orderId }).then(list => list);
    return this._resolveOrderNotes(found);
  }

  /**
   * Finds all Order instructions.
   * @param {string} orderId - MongoDB ObjectId.
   * @return {array} list of order notes for the given order.
   */
  async findAllOrderInstructionsByOrderId(orderId) {
    const found = await SiteOrderInstructionDB.find({ orderId }).then(list => list);
    return this._resolveOrderInstructions(found);
  }

  /**
   * Creates new Order Note.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {object} created site order note document.
   */
  async createOrderNote({ payload = {}, user = {} }) {
    const created = await SiteOrderNoteDB({
      userId: user._id,
      orderId: payload.orderId,
      siteId: payload.siteId,
      content: payload.content
    }).save();

    await SiteOrderActivityDB({
      siteId: payload.siteId,
      orderId: payload.orderId,
      userId: user._id,
      type: 'ORDER_NOTE_CREATED',
      content: payload.content
    }).save();

    return this._resolveOrderNote(created);
  }

  /**
   * Creates new Order Instruction.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {object} created site order instruction document.
   */
  async createOrderInstruction({ payload = {}, user = {} }) {
    const created = await SiteOrderInstructionDB({
      userId: user._id,
      orderId: payload.orderId,
      siteId: payload.siteId,
      email: payload.email,
      deadline: payload.deadline,
      content: payload.content,
      fileURL: payload.fileURL,
      screenshotURL: payload.screenshotURL
    }).save();

    await SiteOrderActivityDB({
      siteId: payload.siteId,
      orderId: payload.orderId,
      userId: user._id,
      type: 'ORDER_INSTRUCTION_CREATED',
      content: `${payload.email} – ${payload.deadline}`
    }).save();

    return this._resolveOrderInstruction(created);
  }

  /**
   * Sends an Order Instruction.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {object} created site order instruction document.
   */
  async sendOrderInstruction({ payload = {}, user = {} }) {
    await SiteOrderInstructionDB.update({
      orderId: payload.orderId,
      siteId: payload.siteId
    }, {
      $set: {
        sentAt: Date.now(),
        isSent: true
      }
    }).save();

    const found = await SiteOrderInstructionDB.findOne({
      orderId: payload.orderId,
      siteId: payload.siteId
    });

    await SiteOrderActivityDB({
      userId: user._id,
      siteId: found._doc.siteId,
      orderId: found._doc.orderId,
      type: 'ORDER_INSTRUCTION_SENT',
      content: `${found._doc.email} – ${found._doc.deadline}`
    }).save();

    return this._resolveOrderInstruction(found._doc);
  }

  /**
   * Generates new Signed URL for S3 file upload.
   * @param {object} payload - destructured payload.
   * @param {object} user - destructured user values.
   * @return {string} signed url string.
   */
  async getS3SignedURL({ payload = {}, user = {} }) {
    const { fileName, fileType, type } = payload;
    if (type !== 'screenshot' && type !== 'file') {
      throw new Error('requires type of either "screenhost" or "file"');
    }

    const fileKey = `flight_instructions/${type}/${fileName}_${Date.now()}_by_${user.id}`;
    const THREE_MINUTES = 180;

    const { signedURL, publicURL } = await getSignedURL({
      fileKey,
      type: fileType,
      expires: THREE_MINUTES,
      ACL: 'public-read'
    });

    return { signedURL, publicURL };
  }
}

export default Order;
