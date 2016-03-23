export default class Nav extends React.component {
  render() {
    var useTag = '<use xlink:href="/svg/svg-sprite#my-icon" />';
    return (
      <nav className="nav-wrapper" id="nav">
        <div className="menu-wrapper">
          <span className="active">&nbsp;</span>
          <ul className="menu nav">
            <li className="menu-item link"><a href="#section-one">Welcome</a></li>
            <li className="menu-item link"><a href="#section-two">Digital</a></li>
            <li className="menu-item link"><a href="#section-three">Art</a></li>
            <li className="menu-item link"><a href="#section-four">About</a></li>
            <li className="menu-item menu-item--blog"><a href="#section-five">
              <svg dangerouslySetInnerHtml={{__html:useTag}}/>
              Blog</a></li>
            </ul>
          </div>
        </nav>
      );
  }
}
