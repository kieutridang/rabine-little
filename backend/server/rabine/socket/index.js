import { SocketConst } from '../constants';

const initialize = (io) => {
  const usersViewingMap = [];

  io.on('connection', (socket) => {

    const validateUser = (listU) => {
      const viewingU = listU;
      if (viewingU.length > 0) {
        // find if exist working user
        const workingU = viewingU.filter(item => item.isBusy === false);
        // if not exist, set the first is working
        if (workingU.length === 0) {
          viewingU[0].isBusy = false;
        } else if (workingU.length > 1) {
          // if exist more than 1 working user, set the first working, otherwise busy
          const idx = viewingU.indexOf(workingU[0]);
          viewingU[idx].isBusy = false;
          for (let i = 1; i < workingU.length; i += 1) {
            const index = viewingU.indexOf(workingU[i]);
            viewingU[index].isBusy = true;
          }
        }
      }
      return viewingU;
    };

    const broadcastUsersViewOneSite = (listUsers, siteId) => {
      const uViewSameSite = validateUser(listUsers.filter(item => (item.sId === siteId)));
      // only 1 user views this site, is busy = false
      if (uViewSameSite.length === 1) {
        uViewSameSite[0].isBusy = false;
        socket.broadcast.emit(SocketConst.ON_GLOBAL_UPDATE, uViewSameSite);
      } else {
        // found all busy users in the list
        const busyU = uViewSameSite.filter(item => (item.isBusy === true));
        // if all busy it means the working user get out, set first user in list => working
        if (busyU.length === uViewSameSite.length) {
          uViewSameSite[0].isBusy = false;
        }
        socket.broadcast.emit(SocketConst.ON_GLOBAL_UPDATE, uViewSameSite);
      }
    };

    socket.on(SocketConst.REQ_USER_STOP_VIEWING_MAP, (data) => {
      const { uId, sId } = data;
      const isMe = usersViewingMap.filter(item => (item.uId === uId
        && item.sId === sId));

      if (isMe.length > 0) {
        const idx = usersViewingMap.indexOf(isMe[0]);
        usersViewingMap.splice(idx, 1);
        socket.emit(SocketConst.RES_USER_STOP_VIEWING_MAP, isMe[0]);
      }

      broadcastUsersViewOneSite(usersViewingMap, sId);
    });

    socket.on(SocketConst.REQ_GET_USERS_VIEWING_MAP, (data) => {
      const { sId, uId } = data;
      // find all users view same site
      const userInfo = usersViewingMap.filter(item => (item.sId === sId));

      // if there is no user, it means only me is viewing, busy = false
      if (userInfo.length === 0) {
        const payload = { sId: sId, uId: uId, isBusy: false };
        usersViewingMap.push(payload);
        socket.emit(SocketConst.RES_GET_USERS_VIEWING_MAP, payload);
      } else {
        // there is another users are viewing this site, find if me in the list
        const isMe = userInfo.filter(item => item.uId === uId);

        // if me is not in list, it means other is viewing, isBusy = true
        if (isMe.length === 0) {
          const payload = { sId: sId, uId: uId, isBusy: true };
          usersViewingMap.push(payload);
          socket.emit(SocketConst.RES_GET_USERS_VIEWING_MAP, payload);
          return;
        } else if (userInfo.length <= 1) {
          // if me is in list and only me view this site, isBusy = false
          isMe[0].isBusy = false;
        }
        socket.emit(SocketConst.RES_GET_USERS_VIEWING_MAP, isMe[0]);
      }

      broadcastUsersViewOneSite(usersViewingMap, sId);
    });
  });
};

export default initialize;
