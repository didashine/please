import { renderSlot } from './until/fn';
export default {
  name: 'cellX',
  created() {
    console.log('cellX created')
  },
  render() {
    return (
      <div class="cellX">
        {renderSlot(this, 'default')}
      </div>
    )
  }
}
