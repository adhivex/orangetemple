import { collectionOg } from '@/lib/collection-og'

export const alt = 'Collection on OrangeTemple'
export const size = collectionOg.size
export const contentType = collectionOg.contentType

export default function Image() {
  return collectionOg.render('jyotirlingas')
}
