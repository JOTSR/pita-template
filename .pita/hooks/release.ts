import info from '@/www/info/info.json' assert { type: 'json' }
import { simpleGit } from 'https://esm.sh/simple-git@3.18.0'

//release main --(patch|minor|major)

const branch = 'main'
await simpleGit().checkout(branch) //choose branch
await simpleGit().pull('origin', branch)
const version =
	(await simpleGit().tag(['--sort=-committerdate'])).split('\n')[0]
const revision = (await simpleGit().log(['-n 1']))?.latest?.hash.slice(0, 9)
await Deno.writeTextFile(
	'../info/info.json',
	JSON.stringify({ ...info, version, revision }, null, '\t'),
)
await simpleGit().add('./info/info.json')
await simpleGit().commit('', ['--amend', '--no-edit'])
await simpleGit().push('origin', branch, ['--tags'])
