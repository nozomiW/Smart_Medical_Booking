// ID 处理工具 - 使用 BigInt 避免精度丢失

export function toBigInt(id) {
  if (id === null || id === undefined) return null
  if (typeof id === 'bigint') return id
  if (typeof id === 'number') return BigInt(id)
  if (typeof id === 'string') return BigInt(id)
  return BigInt(String(id))
}

export function bigIntToString(id) {
  if (id === null || id === undefined) return null
  if (typeof id === 'bigint') return id.toString()
  return String(id)
}

export function idEquals(id1, id2) {
  return toBigInt(id1) === toBigInt(id2)
}

export function normalizeIds(obj, idFields = ['id', 'userId', 'patientId', 'orderId', 'scheduleId']) {
  if (!obj) return obj
  const normalized = { ...obj }
  idFields.forEach(field => {
    if (field in normalized && normalized[field] != null) {
      normalized[field] = toBigInt(normalized[field])
    }
  })
  return normalized
}

export function normalizeArrayIds(arr, idFields = ['id', 'userId', 'patientId', 'orderId', 'scheduleId']) {
  if (!Array.isArray(arr)) return arr
  return arr.map(item => normalizeIds(item, idFields))
}

export function prepareIdParams(params) {
  if (!params) return params
  const prepared = { ...params }
  Object.keys(prepared).forEach(key => {
    if (prepared[key] != null && typeof prepared[key] === 'bigint') {
      prepared[key] = prepared[key].toString()
    }
  })
  return prepared
}
