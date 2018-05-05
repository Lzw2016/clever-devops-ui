// 项目语言(如 Java Node Go PHP)
const LanguageArray = [
  { value: 'Java', label: 'Java' },
  { value: 'Node', label: 'Node' },
  { value: 'Go', label: 'Go' },
  { value: 'PHP', label: 'PHP' },
];

// 代码仓库版本管理方式(如 GIT SVN)
const RepositoryTypeArray = [
  { value: 'GIT', label: 'GIT' },
  { value: 'SVN', label: 'SVN' },
];

// 代码仓库授权类型(0：不需要授权；1：用户名密码；)
const AuthorizationTypeArray = [
  { value: '0', label: '不需要授权' },
  { value: '1', label: '用户名密码' },
];

// 代码编译方式(Maven npm go)
const BuildTypeArray = [
  { value: 'Maven', label: 'Maven' },
  { value: 'npm', label: 'npm' },
];

// 当前镜像构建状态(0：未构建, 1：正在下载代码, 2：正在编译代码, 3：正在构建镜像, S：构建成功, F：构建失败)
const BuildStateArray = [
  { value: '0', label: '未构建' },
  { value: '1', label: '正在下载代码' },
  { value: '2', label: '正在编译代码' },
  { value: '3', label: '正在构建镜像' },
  { value: 'S', label: '构建成功' },
  { value: 'F', label: '构建失败' },
];

export {
  LanguageArray,
  RepositoryTypeArray,
  AuthorizationTypeArray,
  BuildTypeArray,
  BuildStateArray,
};
