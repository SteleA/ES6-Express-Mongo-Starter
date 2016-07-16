import later                   from 'later';

export default function(cb){
  later.setInterval( () => {
    return cb();
  }, later.parse.recur().every(1).hour());
}
