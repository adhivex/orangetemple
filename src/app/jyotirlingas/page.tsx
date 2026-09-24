import { CollectionPage, collectionMetadata } from '@/components/collection/collection-page'

/** Canonical URL for the 12 Jyotirlingas (D-008): a thin wrapper around the one template. */
export const generateMetadata = () => collectionMetadata('jyotirlingas')

export default function JyotirlingasPage() {
  return <CollectionPage slug="jyotirlingas" />
}
