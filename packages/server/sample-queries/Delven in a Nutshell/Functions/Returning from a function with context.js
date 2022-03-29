function xy() {
  return (
    using context(){
    select css('#sel1') from Source()
    union
    select css('#sel1') from Source()
  }
  )
}