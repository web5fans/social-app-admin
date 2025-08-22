/**
* 此文件可以按照工程情况调整，脚本只会在没有生成该文件的情况下生成
*/
import defineAPIHOC from "../utils";
import interceptors from "./interceptors";
// defineAPIHOC 第一个参数为请求方法的公共前缀
const defineAPI = defineAPIHOC("/api/v1", interceptors);
export const defineDAOAPI = defineAPIHOC("/post", interceptors);
export default defineAPI;
