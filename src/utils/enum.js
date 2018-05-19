// 项目语言(如 Java Node Go PHP)
const LanguageArray = [
  { value: 'Java', label: 'Java' },
  { value: 'NodeJS', label: 'NodeJS' },
  { value: 'Go', label: 'Go' },
  { value: 'PHP', label: 'PHP' },
];

const LanguageMapper = {
  'Java': { label: 'Java' },
  'NodeJS': { label: 'NodeJS' },
  'Go': { label: 'Go' },
  'PHP': { label: 'PHP' },
  error: { label: '未知' },
};

// 代码仓库版本管理方式(如 GIT SVN)
const RepositoryTypeArray = [
  { value: 'GIT', label: 'GIT' },
  { value: 'SVN', label: 'SVN' },
];

const RepositoryTypeMapper = {
  'GIT': { label: 'GIT' },
  'SVN': { label: 'SVN' },
  error: { label: '未知' },
};

// 代码仓库授权类型(0：不需要授权；1：用户名密码；)
const AuthorizationTypeArray = [
  { value: '0', label: '不需要授权' },
  { value: '1', label: '用户名密码' },
];

const AuthorizationTypeMapper = {
  '0': { label: '不需要授权' },
  '1': { label: '用户名密码' },
  error: { label: '未知' },
};

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
const BuildStateMapper = {
  '0': { label: '未构建', badgeStatus: 'default', color: 'rgba(0,0,0,.85)' },
  '1': { label: '正在下载代码', badgeStatus: 'processing', color: '#1890ff' },
  '2': { label: '正在编译代码', badgeStatus: 'processing', color: '#1890ff' },
  '3': { label: '正在构建镜像', badgeStatus: 'processing', color: '#1890ff' },
  'S': { label: '构建成功', badgeStatus: 'success', color: '#52c41a' },
  'F': { label: '构建失败', badgeStatus: 'warning', color: '#faad14' },
  error: { label: '未知', badgeStatus: 'error', color: '#f5222d' },
};

const ContainerStateArray = [
  { value: 'created', label: '已创建' },
  { value: 'running', label: '运行中' },
  { value: 'exited', label: '已停止' },
  { value: 'paused', label: '已暂停' },
  { value: 'restarting', label: '重启中' },
];

const ContainerStateMapper = {
  'created': { label: '已创建', badgeStatus: 'default', color: undefined },
  'running': { label: '运行中', badgeStatus: 'processing', color: '#1890ff' },
  'exited': { label: '已停止', badgeStatus: 'error', color: '#f5222d' },
  'paused': { label: '已暂停', badgeStatus: 'warning', color: '#faad14' },
  'restarting': { label: '重启中', badgeStatus: 'processing', color: '#1890ff' },
  error: { label: '未知', badgeStatus: 'error', color: '#f5222d' },
};

const DevopsFlagArray = [
  { value: 'true', label: '使用Devops构建' },
  { value: 'false', label: '其他方式构建' },
];

export {
  LanguageArray,
  LanguageMapper,
  RepositoryTypeArray,
  RepositoryTypeMapper,
  AuthorizationTypeArray,
  AuthorizationTypeMapper,
  BuildTypeArray,
  BuildStateArray,
  BuildStateMapper,
  ContainerStateArray,
  ContainerStateMapper,
  DevopsFlagArray,
};
