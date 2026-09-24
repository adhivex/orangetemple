import { CollectionPage, collectionMetadata } from '@/components/collection/collection-page'

/** Canonical URL for the Char Dham (D-008): a thin wrapper around the one template. */
export const generateMetadata = () => collectionMetadata('char-dham')

export default function CharDhamPage() {
  return <CollectionPage slug="char-dham" />
}
