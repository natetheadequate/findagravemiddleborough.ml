import titleCase from './titleCase';

export default function clean(str){
	return titleCase((' ' + str).replace('join_', '').replaceAll('_', ' '))
}