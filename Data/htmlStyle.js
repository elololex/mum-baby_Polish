export default class htmlStyle {
    
    //other relevant code here
	static getHTMLStyle() {
        const baseColor = global.themeColor
        const baseSize = '13px'
            const style = `
            h1{background-color:${baseColor}; color:#fff;
                padding:10px;
                font-family: Arial;
                font-size: 22px;
            }
            h2{
                font-family: Arial;
            }
            h3{
                font-family: Arial;
                padding:0;
                margin:0;
                font-size: ${baseSize};
                margin-bottom: 5px;
            }
            h4{
                background-color:${baseColor}; 
                padding:5px;
                color:#fff;
                font-size: 18px;
                font-family: Arial;
            }
            
            p{
                font-family: Arial;
                font-size: ${baseSize};
            }
            span{
                font-family: Arial;
                font-size: ${baseSize};
            }
            div{
                margin:0px;
                padding:0px;
                font-family: Arial;
            }
            .main-content {
                padding:0;
                margin:0;
            }
            i{
                font-family: Arial;
                font-size: ${baseSize};
                
            }
            .questiondesc {
                margin-bottom: 20px;
                font-family: Arial;
                font-size: ${baseSize};
            }
            .aboutme {
                display: block;
                position: relative;
                padding: 20px;
                margin-bottom: 10px;
                background-color:#eee;
                font-family: Arial;
            }
            .aboutme div {
                font-family: Arial;
            }
            .aboutme div h3{
                font-family: Arial;
            }
            .questionNBoxes{
                margin-top: 5px;
                page-break-inside: avoid;
            }
            .titleNQuestion{
                page-break-inside: avoid;
                
            }
            .descNanswerbox{
                page-break-inside: avoid;
            }
            .answerbox {
                background-color:#ffffff;
                border: 1px solid #cccccc; 
                border-radius: 5px; 
                padding:0px;
                font-family: Arial;
                margin-top: 10px;
                font-size: ${baseSize};
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            .textInAnswerBox{
                padding:5px;
                min-height: 15px;
                font-family: Arial;
            }
            .checkboxes {
                
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 10px;
            }
            /* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  padding-top: 4px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: ${baseSize};
  font-family: Arial;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: ${baseColor};
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
            `;
            
        return style;
    }
}
