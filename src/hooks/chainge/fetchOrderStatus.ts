import axios from 'axios'

const API_URL = 'https://api2.chainge.finance/v1/checkOrder'

export interface OrderStatusResponse {
  code: number
  msg: string
  data: {
    status: string
    timestamp: number
    execHash: string
    reason: string
    amountOut: string
  }
}

export const fetchOrderStatus = async (orderId: string): Promise<OrderStatusResponse> => {
  try {
    const response = await axios.get<OrderStatusResponse>(API_URL, {
      params: { id: orderId },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.msg || 'Error checking swap order status from Chainge')
  }
}
