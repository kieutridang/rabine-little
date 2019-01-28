import { SocketConst } from '../SiteMapPage/constants';

export const initSocketClient = (socket, userInfo, cb) => {
  let currentSiteId = '';

  socket.on(SocketConst.RES_GET_USERS_VIEWING_MAP, (data) => {
    currentSiteId = data.sId;
    cb(data);
  });

  socket.on(SocketConst.RES_USER_STOP_VIEWING_MAP, () => cb({ isBusy: false }));

  socket.on(SocketConst.ON_GLOBAL_UPDATE, (data) => {
    if (data.length === 0) {
      cb({ isBusy: false });
      return;
    }

    const isMe = data.filter((item) => (item.sId === currentSiteId && item.uId === userInfo._id));
    if (isMe.length > 0) { cb({ isBusy: isMe[0].isBusy }); }
  });
};
