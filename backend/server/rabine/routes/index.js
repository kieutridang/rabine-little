/* eslint-disable */
export const catchAllRoute = require('./catchAllRoute');

export const loginRoute = require('./Authentication/loginRoute');
export const registerRoute = require('./Authentication/registerRoute');
export const logoutRoute = require('./Authentication/logoutRoute');

export const companyLogoPostRoute = require('./CompanyLogo/postRoute');
export const companyLogoDeleteRoute = require('./CompanyLogo/deleteRoute');

export const siteListRoute = require('./Site/listRoute');
export const siteGetRoute = require('./Site/getRoute');
export const postSiteRoute = require('./Site/postRoute');
export const putSiteRoute = require('./Site/putRoute');
export const deleteSiteRoute = require('./Site/deleteRoute');

export const clientListRoute = require('./Client/listRoute');
export const clientGetRoute = require('./Client/getRoute');
export const clientPostRoute = require('./Client/postRoute');
export const clientDeleteRoute = require('./Client/deleteRoute');
export const clientPutRoute = require('./Client/putRoute');
export const clientGetSitesRoute = require('./Client/getSitesByClientRoute');

export const dronePartnerListRoute = require('./DronePartner/listRoute');
export const dronePartnerGetRoute = require('./DronePartner/getRoute');
export const dronePartnerPostRoute = require('./DronePartner/postRoute');

export const siteDesignGetRoute = require('./SiteDesign/getRoute');

export const planDeployListRoute = require('./PlanDeploy/listRoute');
export const orthoCreateRoute = require('./PlanDeploy/orthoCreateRoute');

export const repairListRoute = require('./Repair/listRoute');
export const repairGetRoute = require('./Repair/getRoute');
export const repairPutRoute = require('./Repair/putRoute');

export const siteActivityListRoute = require('./SiteActivity/listRoute');
export const siteActivityGetRoute = require('./SiteActivity/getRoute');
export const siteActivityPutRoute = require('./SiteActivity/putRoute');

export const siteOrderListRoute = require('./SiteOrder/listRoute');
export const siteOrderGetRoute = require('./SiteOrder/getRoute');
export const siteOrderPostRoute = require('./SiteOrder/postRoute');
export const siteOrderPutRoute = require('./SiteOrder/putRoute');

export const siteOrderNoteListRoute = require('./SiteOrderNote/listRoute');
export const siteOrderNotePostRoute = require('./SiteOrderNote/postRoute');

export const siteOrderActivityListRoute = require('./SiteOrderInstruction/listActivityRoute');

export const siteOrderInstructionListRoute = require('./SiteOrderInstruction/listRoute');
export const siteOrderInstructionPostRoute = require('./SiteOrderInstruction/postRoute');
export const siteOrderInstructionSendRoute = require('./SiteOrderInstruction/sendRoute');
export const siteOrderInstructionGetSignedURLFileRoute = require('./SiteOrderInstruction/getSignedURLFileRoute');
export const siteOrderInstructionGetSignedURLScreenshotRoute = require('./SiteOrderInstruction/getSignedURLScreenshotRoute');

export const siteAreaListRoute = require('./SiteArea/listRoute');
export const siteAreaPutRoute = require('./SiteArea/putRoute');
export const siteAreaGetRoute = require('./SiteArea/getRoute');
export const siteAreaGetSharedLinkRoute = require('./SiteArea/getSharedLinkRoute');
export const siteAreaGetWithTokenRoute = require('./SiteArea/getWithTokenRoute');

export const siteMapGetRoute = require('./SiteMap/getRoute');
export const siteMapPutRoute = require('./SiteMap/putRoute');

export const siteMapGetChanges = require('./SiteMap/getChangesRoute');
export const siteMapGetFeatures = require('./SiteMap/getFeaturesRoute');
export const siteMapPostFeatureRoute = require('./SiteMap/postFeatureRoute');
export const siteMapPutFeaturesOrderRoute = require('./SiteMap/putFeaturesOrderRoute');
export const siteMapPutFeatureRoute = require('./SiteMap/putFeatureRoute');
export const siteMapDeleteFeatureRoute = require('./SiteMap/deleteFeatureRoute');

export const siteMapGetLayers = require('./SiteMap/getLayersRoute');
export const siteMapPostLayerRoute = require('./SiteMap/postLayerRoute');
export const siteMapPutLayersOrderRoute = require('./SiteMap/putLayersOrderRoute');
export const siteMapPutLayerRoute = require('./SiteMap/putLayerRoute');
export const siteMapToggleLayerStatusRoute = require('./SiteMap/toggleLayerStatusRoute');
export const siteMapDeleteLayerRoute = require('./SiteMap/deleteLayerRoute');

export const siteMapGetSharedLinkRoute = require('./SiteMap/getSharedLinkRoute');
export const siteMapGetWithToken = require('./SiteMap/getSiteMapWithToken');

export const clientNoteListRoute = require('./ClientNote/listRoute');
export const clientNoteGetRoute = require('./ClientNote/getRoute');
export const clientNotePutRoute = require('./ClientNote/putRoute');

export const sitePhotoPutRoute = require('./SiteAreaPhoto/putRoute');
export const toggleDefectedRoute = require('./SiteAreaPhoto/toggleDefectedRoute');
export const setDefectRepairRoute = require('./SiteAreaPhoto/setDefectRepairRoute');
export const setDefectSeverityRoute = require('./SiteAreaPhoto/setDefectSeverityRoute');
export const toggleRepairRoute = require('./SiteAreaPhoto/toggleRepairRoute');
export const setRepairNameRoute = require('./SiteAreaPhoto/setRepairNameRoute');

export const getAnnotationRoute = require('./SiteAreaPhotoAnnotation/getAnnotationRoute');
export const postAreaPhotoAnnotationRoute = require('./SiteAreaPhotoAnnotation/postAnnotationRoute');
export const putAreaPhotoAnnotationRoute = require('./SiteAreaPhotoAnnotation/putAnnotationRoute');
export const deleteAreaPhotoAnnotationRoute = require('./SiteAreaPhotoAnnotation/deleteAnnotationRoute');


export const getOrthoTemplateRoute = require('./SiteMap/getOrthoTemplateRoute');
export const orderListRoute = require('./Order/listRoute');

export const listRepairPolygonRoute = require('./SiteRepair/listRepairPolygonRoute');
export const listZonePolygonRoute = require('./SiteRepair/listZonePolygonRoute');
export const exportRoute = require('./SiteRepair/exportRoute');
export const postRepairInputRoute = require('./SiteRepair/postRepairInputRoute');
export const postSiteRepairRoute = require('./SiteRepair/postRoute');
export const putSiteRepairRoute = require('./SiteRepair/putRoute');
export const deleteSiteRepairRoute = require('./SiteRepair/deleteRoute');
export const repairGetCropUploadURLRoute = require('./SiteRepair/getCropUploadURLRoute');
export const repairSetCropUploadedRoute = require('./SiteRepair/setCropUploadedRoute');

export const getMetricsRoute = require('./Metrics/getRoute');
export const listZoneOptionsRoute = require('./SiteRepair/listZoneOptionsRoute');

export const getSiteS3FoldersRoute = require('./SiteS3Folder/listRoute');
export const exportBySiteIdsRoute = require('./SiteRepair/exportBySiteIdsRoute');
export const exportZonesBySiteIdsRoute = require('./SiteRepair/exportZonesBySiteIdsRoute');

export const userListRoute = require('./User/listRoute');
export const inviteUserRoute = require('./User/inviteUserRoute');
export const listInvitedUsersRoute = require('./User/listInvitedUsersRoute');
export const requestResetPasswordRoute = require('./User/requestResetPasswordRoute');
export const resetPasswordRoute = require('./User/resetUserPasswordRoute');
export const getInvitedUserByIdRoute = require('./User/getInvitedUserByIdRoute');

export const videoListRoute = require('./SiteAreaVideo/listRoute');

export const getInfoS3Route = require('./S3Aws/getInfoS3Route');

export const getSiteMapCommentRoute = require('./SiteMapComment/getRoute');
export const listSiteMapCommentRoute = require('./SiteMapComment/listRoute');
export const postSiteMapCommentRoute = require('./SiteMapComment/postRoute');
export const postSharedSiteMapCommentRoute = require('./SiteMapComment/sharedPostRoute');
export const deleteRoute =  require('./SiteMapComment/deleteRoute');

export const getClientSheetRoute =  require('./ClientSheet/getRoute');
export const postClientSheetRoute =  require('./ClientSheet/postRoute');

export const postPhotoRoute =  require('./SiteBidSheet/postPhotoRoute');
export const listPhotoRoute =  require('./SiteBidSheet/listPhotoRoute');

export const getRepairPhotoRoute =  require('./RepairPhoto/getRoute');

export const getRepairCommentRoute =  require('./SiteRepairComment/getRoute');
export const deleteRepairCommentRoute =  require('./SiteRepairComment/deleteRoute');
export const listRepairCommentRoute =  require('./SiteRepairComment/listRoute');
export const postRepairCommentRoute =  require('./SiteRepairComment/postRoute');
export const sharedPostRepairCommentRoute =  require('./SiteRepairComment/sharedPostRoute');

export const syncS3Route = require('./S3Aws/syncS3Route');
export const removeS3Route = require('./S3Aws/removeS3Route');

export const listHVACRoute = require('./HVAC/listRoute');
export const postHVACRoute = require('./HVAC/postRoute');
export const putHVACRoute = require('./HVAC/putRoute');
export const deleteHVACRoute = require('./HVAC/deleteRoute');

export const listRoofingFeatureRoute = require('./RoofingFeature/listRoute');
export const postRoofingFeatureRoute = require('./RoofingFeature/postRoute');
export const deleteRoofingFeatureRoute = require('./RoofingFeature/deleteRoute');
export const putRoofingFeatureRoute = require('./RoofingFeature/putRoute');
export const syncRoofingFeatureRoute = require('./RoofingFeature/syncRoute');

export const postAreaPhotoRepairRoute = require('./SiteAreaPhoto/postAreaPhotoRepair');
export const getAreaPhotoRepairsRoute = require('./SiteAreaPhoto/getAreaPhotoRepair');
export const deleteAreaPhotoRepairRoute = require('./SiteAreaPhoto/deleteAreaPhotoRepair');


// export const syncRoute = require('./S3Aws/syncRoute');
