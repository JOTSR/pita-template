import { join } from '@std/path/mod.ts'
import project from '@pita/project.json' assert { type: 'json' }
const { host, uuid } = project

const dir = `/opt/redpitaya/www/apps/${uuid}`

// await new Deno.Command('ssh', {
// 	args: [
// 		host,
// 		'/opt/redpitaya/sbin/rw -a -w',
// 		// `"`,
// 	],
// }).spawn().status

//Clean directory
console.log(
	`%c[pita]%c clean redpitaya directory %c{ssh ${host} rm -rf ${dir}}`,
	'color: royalblue; font-weight: bold',
	'color: white; font-weight: normal',
	'color: lightgrey; font-weight: normal',
)
await new Deno.Command('ssh', {
	args: [
		host,
		`rm -rf ${dir}`,
	],
}).spawn().status

//Copy directory to RP
console.log(
	`%c[pita]%c copy files to redpitaya %c{scp -r ${
		join(Deno.cwd(), 'www')
	} ${host}:${dir}}`,
	'color: royalblue; font-weight: bold',
	'color: white; font-weight: normal',
	'color: lightgrey; font-weight: normal',
)
await new Deno.Command('scp', {
	args: [
		'-r',
		'www',
		`${host}:${dir}`,
	],
}).spawn().status

//ssh
console.log(
	`%c[pita]%c install fpga bitstream %c{ssh ${host} "cd ${dir} && make INSTALL_DIR=/opt/redpitaya && ./fpga.sh v0.94"}`,
	'color: royalblue; font-weight: bold',
	'color: white; font-weight: normal',
	'color: lightgrey; font-weight: normal',
)
await new Deno.Command('ssh', {
	args: [
		host,
		`"cd ${dir} && make INSTALL_DIR=/opt/redpitaya && ./fpga.sh v0.94"`,
	],
}).spawn().status
