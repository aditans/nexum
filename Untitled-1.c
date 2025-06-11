
#include <stdio.h>
#include <stdlib.h> 
 
int main(int argc, char *argv[]) {
   
    int i;
    int num1 = atoi(argv[1]);
    printf("%d",num1);
    for(i=2;i<num1;i=i+2)
    {
        if((num1-i)%2==0)
        {
            printf("YES");
            return 0;
        }
        
    }
    printf("NO");
    return 0;
}