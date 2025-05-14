import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/bpm',
    name: 'bpm',
    meta: {
      title: '工作流',
      hideInMenu: true,
    },
    children: [
      {
        path: 'task',
        name: 'BpmTask',
        meta: {
          title: '审批中心',
          icon: 'ant-design:history-outlined',
        },
        children: [
          {
            path: 'my',
            name: 'BpmTaskMy',
            component: () => import('#/views/bpm/processInstance/index.vue'),
            meta: {
              title: '我的流程',
            },
          },
        ],
      },

      {
        path: 'process-instance/detail',
        component: () => import('#/views/bpm/processInstance/detail/index.vue'),
        name: 'BpmProcessInstanceDetail',
        meta: {
          title: '流程详情',
          activePath: '/bpm/task/my',
          icon: 'ant-design:history-outlined',
          keepAlive: false,
          hideInMenu: true,
        },
        props: (route) => {
          return {
            id: route.query.id,
            taskId: route.query.taskId,
            activityId: route.query.activityId,
          };
        },
      },
    ],
  },
];

export default routes;
