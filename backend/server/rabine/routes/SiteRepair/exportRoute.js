const Boom = require('boom');
const { Parser: Json2csvParser } = require('json2csv');
const { siteRepairValidation } = require('../../validations');
const { SiteZoneTemplate, SiteRepairTemplate } = require('../../constants');

const exportRepairRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/polygon/{type}/export',
  config: {
    tags: ['api', 'repair', 'site'],
    description: 'Get repair info',
    notes: 'Get repair info',
    validate: {
      params: siteRepairValidation.repairExportRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId, type } = req.params;
      const { site } = req.server;

      return site.getById(siteId)
        .then((siteInfo) => {
          const filename = siteInfo ? siteInfo.name.replace(/'/g, '\\\'') : siteId;

          return site.Repair.exportExcel(siteId, type)
          .then((data) => {
            if (data) {
              const sites = data.map(siteData => ({ ...siteData, siteName: filename }));
              let fields;

              if (type === 'zone') {
                fields = [...SiteZoneTemplate];
              } else {
                fields = [...SiteRepairTemplate];
              }

              const json2csvParser = new Json2csvParser({ fields });
              const csv = json2csvParser.parse(sites);

              return reply(csv)
                .header('Content-Type', 'application/octet-stream')
                .header('Content-Disposition', `'attachment; filename=${filename}_${type}.csv`)
                .code(200);
            }

            return reply(Boom.notFound());
          }).catch(err => reply(Boom.badRequest(err.message)));
        });
    }
  }
};

module.exports = exportRepairRoute;
