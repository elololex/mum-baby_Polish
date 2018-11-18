import { Analytics, PageHit, ScreenHit, Event } from 'expo-analytics';
export default class AnalyticsTool {
    static analytics = new Analytics('UA-127663835-1');
    
    //other relevant code here
	static hitPage(hit) {
        //const analytics = new Analytics('UA-127663835-1');
        //console.log(this.analytics.clientId.toString(), this.analytics.propertyId.toString())
        this.analytics.hit(new ScreenHit(hit))
        .then((result) => console.log("analytics success", result))
        .catch(e => console.log(e.message));
    }
    static hitEvent(cat,type,uri){
        this.analytics.event(new Event(cat, type, uri))
        .then(() => console.log("success"))
        .catch(e => console.log(e.message));
    }
    
}