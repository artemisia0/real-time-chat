import path from 'path'
import { readFileSync } from 'fs'


const typeDefs = readFileSync(path.resolve('./src/graphql/schema.graphql'), {
	encoding: 'utf-8',
})

export default typeDefs

