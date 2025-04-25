import request from '@/config/axios'

export interface UserVO {
  id: number
  mobile: string
  password: string
  status: number
  registerIp: string
  loginIp: string
  loginDate: Date
  nickname: string
  avatar: string
  name: string
  sex: number
  areaId: number
  birthday: Date
  mark: string
  createTime: Date
}

// 查询会员用户列表
export const getUserPage = async (params) => {
  return await request.get({ url: `/member/user/page`, params })
}

// 查询会员用户详情
export const getUser = async (id: number) => {
  return await request.get({ url: `/member/user/get?id=` + id })
}

// 修改会员用户
export const updateUser = async (data: UserVO) => {
  return await request.put({ url: `/member/user/update`, data })
}
