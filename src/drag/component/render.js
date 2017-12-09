export const _renderSlot = (_this, data, type) => {
  type = type || 'default'
  return _this.$slots[type] ? _this.$slots[type] :
    _this.$scopedSlots[type](data)
}
