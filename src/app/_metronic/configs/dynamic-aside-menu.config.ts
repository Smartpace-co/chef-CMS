export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },

    { section: 'Applications' },
    {
      title: 'eCommerce',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      root: true,
      permission: 'accessToECommerceModule',
      page: '/ecommerce',
      submenu: [
        {
          title: 'Customers',
          page: '/ecommerce/customers'
        },
        {
          title: 'Products',
          page: '/ecommerce/products'
        },
      ]
    },
    {
      title: 'Manage Role',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage Users',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage Subscription Packages',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage District Admin Accounts',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage schools',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage tools',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage ingredients',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage nutrients',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage culinary techniques',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage countries',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage lessons',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage stamps',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage units of measurement',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage issues or feedback',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'Manage conversations sentences',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Cart3.svg',
      page: '/manage-role/list',
    },
    {
      title: 'User Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/user-management',
      submenu: [
        {
          title: 'Users',
          page: '/user-management/users'
        },
        {
          title: 'Roles',
          page: '/user-management/roles'
        }
      ]
    },
    {
      title: 'User Profile',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Communication/Add-user.svg',
      page: '/user-profile',
    }
  ]
};
