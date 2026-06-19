import { useState, useEffect } from 'react';
export const useFetch = (apiFunction, param = null) => {

    const [data, setData] = useState(null);   
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');     

    //  יוז-אפקט שירוץ פעם אחת כשהעמוד עולה
    useEffect(() => {
                if (!localStorage.getItem('token')) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await apiFunction(param); 
                
                if (result && result.success) {
                    setData(result); 
                    
                } else {
                    setError('שגיאה בקבלת הנתונים מהשרת.');
                }
            } catch (err) {
                setError('שגיאה בתקשורת עם השרת.'); 
            } finally {
                setLoading(false); 
            }
        };

        if (param !== undefined) {
            fetchData();
        }
    }, [apiFunction, param]); 

    return { data, loading, error };
};
