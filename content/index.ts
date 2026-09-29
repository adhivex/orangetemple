import { collections } from './collections'
import { deities } from './deities'
import { states } from './states'
import badrinath from './temples/badrinath'
import baidyanathDeoghar from './temples/baidyanath-deoghar'
import bhimashankar from './temples/bhimashankar'
import dwarkadhishDwarka from './temples/dwarkadhish-dwarka'
import grishneshwar from './temples/grishneshwar'
import jagannathPuri from './temples/jagannath-puri'
import kashiVishwanath from './temples/kashi-vishwanath'
import kedarnath from './temples/kedarnath'
import mahakaleshwarUjjain from './temples/mahakaleshwar-ujjain'
import mallikarjunaSrisailam from './temples/mallikarjuna-srisailam'
import nageshwarDwarka from './temples/nageshwar-dwarka'
import omkareshwar from './temples/omkareshwar'
import rameshwaram from './temples/rameshwaram'
import somnath from './temples/somnath'
import trimbakeshwar from './temples/trimbakeshwar'

/**
 * The complete seed content. To add a temple: create its file in ./temples, import it
 * here, and add its slug to the relevant collections. No application code changes.
 */
export const seedData = {
  states,
  deities,
  temples: [
    somnath,
    mallikarjunaSrisailam,
    mahakaleshwarUjjain,
    omkareshwar,
    kedarnath,
    bhimashankar,
    kashiVishwanath,
    trimbakeshwar,
    baidyanathDeoghar,
    nageshwarDwarka,
    rameshwaram,
    grishneshwar,
    badrinath,
    dwarkadhishDwarka,
    jagannathPuri,
  ],
  collections,
}

export type SeedData = typeof seedData
