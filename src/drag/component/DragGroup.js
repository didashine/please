import _renderSlot from './render'
export default {
  render() {
    return (
      <div>
        {
          _renderSlot(this, this.renderData)
        }
      </div>
    )
  },
  provide: {
    drag_dos_name: 'drag_dos'
  },
  data() {
    return {
      renderData: '',
      drag_dos: {}
    }
  }
}
