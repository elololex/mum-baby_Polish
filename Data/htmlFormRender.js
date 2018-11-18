import { StyleSheet, View,Text ,AsyncStorage,Button, Share} from 'react-native';
import DomSelector from 'react-native-dom-parser';
export default class htmlFormRender {
    //let orginalhtml;
    constructor(pagekey, orginalhtml, minHeight = 100) {
        this.orginalhtml = orginalhtml;
        this.pagekey = pagekey;
        this.minHeight = minHeight;
        console.log("this.pagekey: " + this.pagekey);
      console.log(orginalhtml);
      this.rebuildAboutMe = this.rebuildAboutMe.bind(this);
    }
    async getTitle(){
        
        let beginIndex = this.orginalhtml.indexOf(`<h1>`)+0;
        let endIndex = this.orginalhtml.indexOf(`</h1>`,beginIndex)+5;
        const hTitle = this.orginalhtml.substring(beginIndex,endIndex);
        this.orginalhtml = this.orginalhtml.substring(endIndex,this.orginalhtml.length)
        
        const header =`<div style="height:0px;"></div>`+hTitle
        console.log('render title: ',)
        return(
            header
        );
    }
    async rebuildAboutMe(jsonAnswers,answerCount, html){
        const rootNode = DomSelector(html);
        let answerObject = new Object();

        if(jsonAnswers.length> answerCount){
            answerObject.questionIndex = jsonAnswers[answerCount].questionIndex;
            answerObject.textResponse = jsonAnswers[answerCount].textResponse;
        }
        else{
            answerObject.questionIndex = answerCount;
            answerObject.textResponse = '';
        }
        answerObject.checkBoxesResponse = [];
        answerObject.checkBoxesText = [];
        answerObject.questionDescription = undefined;
        answerObject.questionHint = undefined;
       // let questions = rootNode.getElementsByClassName('question');
        for (var i = 0;  i<rootNode.children.length; i++) {
            const tempElement = rootNode.children[i];
            console.log('About me html: ')
            
            if(tempElement.attributes['data-due-date'] != undefined){
                console.log('data-due-date found')
                if(global.duedate != null){
                    answerObject.textResponse = global.duedate;
                }
            }
            if(tempElement.attributes['data-my-hospital'] != undefined){
                console.log('data-my-hospital found')
                if(global.myhospitalTitle != null){
                    answerObject.textResponse = global.myhospitalTitle;
                }
                
            }
            if(tempElement.children[0].text != undefined){
                console.log(tempElement.children[0].text)
                answerObject.questionTitle = tempElement.children[0].text;
            }
            
        }
        //console.log("About me html: "+html);
        return(
            this.generateQuestion(answerObject)
        );
    }
    async generateHTML(){
        let startIndex = 0;
        const answersValue = await AsyncStorage.getItem('@'+this.pagekey+'_answers:key');
        var jsonAnswers =[]
        if(answersValue != undefined){
            jsonAnswers = JSON.parse(answersValue);
        } 
        
        console.log("answers: " + jsonAnswers.length);
        
        let answerCount = 0;
        while (this.orginalhtml.indexOf(`<div class="linkStart"></div>`) >= 0){
            console.log('create start titleNQuestion');
            this.orginalhtml = String(this.orginalhtml).replace(`<div class="linkStart"></div>`, `<div class="titleNQuestion">`)
        }
        
        while (this.orginalhtml.indexOf(`<div class="linkEnd"></div>`) >= 0){
            console.log('create end titleNQuestion');
            this.orginalhtml = String(this.orginalhtml).replace(`<div class="linkEnd"></div>`, `</div>`)
        }
        /*while (this.orginalhtml.indexOf(`<div class="linkStart"/>`) >= 0){
            this.orginalhtml = String(this.orginalhtml).replace(`<div class="linkStart"/>`, `<div class="titleNQuestion">`)
        }
        while (this.orginalhtml.indexOf(`<div class="linkEnd"/>`) >= 0){
            this.orginalhtml = String(this.orginalhtml).replace(`<div class="linkEnd"/>`, `</div>`)
        }*/
        while (this.orginalhtml.indexOf(`<div data-cat="question">`,startIndex) >= 0){
            let beginIndex = this.orginalhtml.indexOf(`<div data-cat="question">`,startIndex);
            let tempBeginning = beginIndex;
            let endIndex = this.orginalhtml.indexOf(`</div>`,beginIndex)+6;
            //endIndex = this.orginalhtml.indexOf(`</div>`,endIndex)+6;
            console.log("test found div inside");
            let endFound = false;
            while(!endFound){
                //let subHTML = this.orginalhtml.substring(tempBeginning,endIndex);
                tempBeginning = this.orginalhtml.indexOf('<div',tempBeginning+5);
                if(tempBeginning<endIndex && tempBeginning>=0){

                    let newEndIndex = this.orginalhtml.indexOf(`</div>`,endIndex)+6;
                    if(newEndIndex>0){
                        endIndex = newEndIndex;
                        //endFound = true;
                    }
                    else{
                        endFound = true;
                    }
                }
                else{
                    endFound = true;
                }
                
                console.log("found div inside", tempBeginning, endIndex);
            }
            if(this.pagekey === "about-me"){
                let aboutMeQuestion = await this.rebuildAboutMe(jsonAnswers,answerCount,this.orginalhtml.substring(beginIndex,endIndex));
                this.orginalhtml = this.orginalhtml.substring(0,beginIndex)+aboutMeQuestion+this.orginalhtml.substring(endIndex,this.orginalhtml.length);
            }
            else if(jsonAnswers.length>answerCount){
                console.log('question html: '+this.orginalhtml.substring(beginIndex,endIndex));
                let question = await this.generateQuestion(jsonAnswers[answerCount], this.orginalhtml.substring(beginIndex,endIndex));
                this.orginalhtml = this.orginalhtml.substring(0,beginIndex)+question+this.orginalhtml.substring(endIndex,this.orginalhtml.length);
            }

            else{
                startIndex = endIndex;
            }
            answerCount++;
            
        }
        return(
            this.orginalhtml
        );
    }
    generateQuestion(answer, htmlText = null){
        console.log('answer: '+JSON.stringify(answer));
        let questionHTML = '<div><div class="questionNBoxes">';
        
        if(htmlText != null){
            let updateQuestion = String(htmlText).substring(String(htmlText).indexOf('<h3>')+4,String(htmlText).indexOf('</h3>'));
            console.log('updateQuestion: '+updateQuestion);
            let extraText = updateQuestion.substring(updateQuestion.indexOf('<'),updateQuestion.lastIndexOf('>'));
            updateQuestion = updateQuestion.replace(extraText, '');
            questionHTML += '<h3>'+updateQuestion+'</h3>'
            questionHTML += extraText
        }
        else if(answer.questionTitle != ''){
            questionHTML += '<h3>'+answer.questionTitle+'</h3>'
        }
        
        let checkBox = '';
        let checkboxesExist = false;
        if(answer.checkBoxesText.length>0){
            checkBox = `<form class="checkboxes">`
            checkboxesExist = true;

            for(var i = 0; i<answer.checkBoxesText.length; i++){
                checkBox +='<label class="container">'
                checkBox += answer.checkBoxesText[i]
                checkBox += ' <input type="checkbox"';
                if(answer.checkBoxesResponse[i] === true){
                    checkBox += ' checked="checked"'
                }
                checkBox += '/><span class="checkmark"></span></label>'
                

            }
            checkBox +='</form>';
        }
        questionHTML += checkBox;
        if(checkboxesExist == true){
            questionHTML += '</div>'
        }
        questionHTML += `<div class="descNanswerbox">`;
        if(answer.questionDescription!='' && answer.questionDescription!=undefined){
            questionHTML += '<i class="questiondesc">'+answer.questionDescription+'</i>'
        }
        
        questionHTML += `<div class="answerbox" style="min-height: ${this.minHeight}px;">
        <div class="textInAnswerBox">
        `
            
        if(answer.questionHint != undefined){
            questionHTML += '<i style="color:grey">'+answer.questionHint+'</i>'
        }

        const encodeText = answer.textResponse.replace(/\r?\n/g, "<br />");
        questionHTML += encodeText+'</div></div>'
        if(checkboxesExist == false){
            questionHTML += '</div>'
        }
        questionHTML += '</div></div>'
        console.log('redone question html: '+questionHTML);
        return(
            questionHTML
        );
    }
  }